FROM node
MAINTAINER Mateo Tutic <mateo.tutic@heig-vd.ch>

#
# When we build the image, we copy javascript sources in the image file system.
#
COPY src /opt/app/
WORKDIR /opt/app/
RUN npm install

CMD ["node", "/opt/app/auditor.js"]